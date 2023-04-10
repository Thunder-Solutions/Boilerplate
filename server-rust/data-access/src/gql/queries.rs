use async_graphql::{FieldResult, Object};

pub struct Query;

#[Object]
impl Query {
    async fn parse_without_extensions(&self) -> FieldResult<i32> {
        Ok("234a".parse()?)
    }
}
