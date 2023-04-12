use crate::{error::Error, model::User};
use bson::{doc, oid::ObjectId};
use mongodb::Database;
use utilities::*;

impl User {
    pub async fn get(database: &Database, id: ObjectId) -> Result<Option<Self>, Error> {
        let users = database.collection::<User>("user");
        Ok(users.find_one(doc! { "_id" : id}, None).await?)
    }

    pub async fn add(
        database: &Database,
        username: String,
        email: String,
        display_name: String,
        password: String,
    ) -> Result<Self, Error> {
        let users = database.collection::<User>("user");
        let (hash, salt) = new_hash_password(&password).map_err(|_| Error::HashError)?;
        let user = Self {
            id: ObjectId::new(),
            username,
            email,
            display_name,
            hash,
            salt,
            tokens: Vec::new(),
        };
        let _ = users.insert_one(&user, None).await?;
        Ok(user)
    }
}
