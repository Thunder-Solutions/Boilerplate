use bson::{doc, oid::ObjectId, Document};
use mongodb::Database;

use crate::{error::Error, model::User};

pub async fn logout(
    database: Database,
    user_id: ObjectId,
    refresh_token: String,
    everywhere: bool,
) -> Result<(), Error> {
    let users = database.collection::<User>("user");

    users
        .find_one(doc! { "id" : user_id}, None)
        .await?
        .ok_or(Error::UserNotFound)?;

    let operation: Document;
    if everywhere {
        operation = doc! { "$set" : { "tokens" : []}};
    } else {
        operation = doc! { "$pull" : { "tokens" : refresh_token}};
    }

    let _ = users
        .find_one_and_update(doc! { "id" : user_id}, operation, None)
        .await?;

    Ok(())
}
