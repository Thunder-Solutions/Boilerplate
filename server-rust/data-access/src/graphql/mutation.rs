use async_graphql::{Context, Object};
use mongodb::Database;

use crate::{error::Error, model::User};

pub struct Mutation;

#[Object]
impl Mutation {
    async fn signup(
        &self,
        ctx: &Context<'_>,
        username: String,
        password: String,
        display_name: String,
        email: String,
    ) -> Result<User, Error> {
        let database = ctx.data_unchecked::<Database>();
        User::add(&database, username, email, display_name, password).await
    }
}
