mod todo;
mod user;

use mongodb::{
    options::{ClientOptions, ResolverConfig},
    Client, Collection, Database,
};
pub use todo::*;
pub use user::*;

pub struct MongoDB {
    pub db: Database,
    pub users: Collection<User>,
    pub todos: Collection<Todo>,
}

pub async fn get_connection() -> MongoDB {
    let client_uri =
        dotenvy::var("MONGODB_URI").expect("You must set the MONGODB_URI environment var!");

    let options =
        ClientOptions::parse_with_resolver_config(&client_uri, ResolverConfig::cloudflare())
            .await
            .unwrap();

    let db = Client::with_options(options).unwrap().database("app");

    let users = db.collection("users");
    let todos = db.collection("todos");

    MongoDB { db, users, todos }
}
