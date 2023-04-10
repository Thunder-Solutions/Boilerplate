use std::error::Error;

use async_graphql::{EmptySubscription, Schema};
use axum::{routing::get, Router, Server};
use data_access::model::get_connection;
use gql::SchemaType;

use crate::gql::{graphiql, graphql_handler, mutations::Mutation, queries::Query};

pub mod api;
pub mod error;
pub mod gql;
pub mod model;

#[derive(Clone)]
pub struct AppState {
    pub schema: SchemaType,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(get_connection().await)
        .limit_complexity(5000)
        .finish();

    let state = AppState { schema };

    let app = Router::new()
        .route("/", get(graphiql).post(graphql_handler))
        .with_state(state);

    println!("GraphiQL IDE: http://localhost:8000");

    Server::bind(&"127.0.0.1:8000".parse().unwrap())
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
