use bson::{doc, oid::ObjectId};
use mongodb::Database;
use utilities::generate_token;

use crate::{error::Error, model::User};

use super::AccessToken;

pub async fn new_token(
    database: Database,
    user_id: ObjectId,
    refresh_token: String,
) -> Result<String, Error> {
    let users = database.collection::<User>("user");
    let user = users
        .find_one(doc! { "_id" : user_id}, None)
        .await?
        .ok_or(Error::UserNotFound)?;
    if !user.tokens.contains(&refresh_token) {
        return Err(Error::InvalidRefreshToken);
    }

    let access_token = generate_token(&AccessToken {
        sub: user.id,
        email: user.email,
        username: user.username,
        exp: (chrono::offset::Utc::now() + chrono::Duration::minutes(15)).timestamp() as usize,
    })
    .map_err(|_| Error::HashError)?;
    Ok(access_token)
}
