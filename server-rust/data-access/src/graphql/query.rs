use async_graphql::Context;
use bson::oid::ObjectId;
use mongodb::Database;

use crate::{
    api::{login, AccessToken, LoginResponse},
    error::Error,
    model::User,
};

pub struct QueryRoot;

#[async_graphql::Object]
impl QueryRoot {
    // exmaple of a protected route
    async fn get_user(&self, ctx: &Context<'_>, user_id: ObjectId) -> Result<Option<User>, Error> {
        let _user = ctx.data::<AccessToken>().map_err(|_| Error::Unauthorized)?;
        let database = ctx.data_unchecked::<Database>();
        User::get(&database, user_id).await
    }

    async fn login_user(
        &self,
        ctx: &Context<'_>,
        username: String,
        password: String,
    ) -> Result<LoginResponse, Error> {
        let database = ctx.data_unchecked::<Database>();
        login(&database, username, password).await
    }
}
