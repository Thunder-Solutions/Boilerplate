use std::env::var;

use api::AccessToken;
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};
use axum::{
    http::HeaderMap, response, response::IntoResponse, routing::get, Extension, Router, Server,
};
use dotenv::dotenv;
use graphql::{Mutation, QueryRoot};
use utilities::decode_token;

use crate::database::connect_database;

pub mod api;
pub mod database;
pub mod error;
pub mod graphql;
pub mod model;

pub type GraphQLSchema = Schema<QueryRoot, Mutation, EmptySubscription>;

fn get_access_token(headers: &HeaderMap) -> Option<AccessToken> {
    headers
        .get("x-jwt-token")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| {
            decode_token::<AccessToken>(
                value,
                &var("ACCESS_TOKEN_SECRET").expect("access token secret not preset!"),
            )
            .ok()
        })
}

async fn graphql_handler(
    headers: HeaderMap,
    schema: Extension<GraphQLSchema>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut req = req.into_inner();
    if let Some(token) = get_access_token(&headers) {
        req = req.data(token);
    }
    schema.execute(req).await.into()
}

async fn graphiql() -> impl IntoResponse {
    response::Html(
        GraphiQLSource::build()
            .endpoint("/")
            .subscription_endpoint("/ws")
            .finish(),
    )
}

#[tokio::main]
async fn main() {
    let _ = dotenv().ok();
    let client = connect_database().await.unwrap();
    let schema = Schema::build(QueryRoot, Mutation, EmptySubscription)
        .data(client.database("test"))
        .finish();

    let app = Router::new()
        .route("/", get(graphiql).post(graphql_handler))
        .route_service("/ws", GraphQLSubscription::new(schema.clone()))
        .layer(Extension(schema));

    println!("GraphiQL IDE: http://localhost:8000");

    Server::bind(&"127.0.0.1:8000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
