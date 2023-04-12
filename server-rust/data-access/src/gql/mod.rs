use async_graphql::http::GraphiQLSource;
use async_graphql::{EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::response::IntoResponse;
use axum::{response, Extension};

use self::mutations::Mutation;
use self::queries::Query;

pub mod mutations;
pub mod queries;

pub type SchemaType = Schema<Query, Mutation, EmptySubscription>;

pub async fn graphql_handler(
    schema: Extension<SchemaType>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

pub async fn graphiql() -> impl IntoResponse {
    response::Html(GraphiQLSource::build().endpoint("/").finish())
}
