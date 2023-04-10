use async_graphql::{FieldResult, Object};

pub struct Mutation;

#[Object]
impl Mutation {
    async fn parse_with_extensions(&self) -> FieldResult<i32> {
        Ok("234a".parse()?)
    }
}
