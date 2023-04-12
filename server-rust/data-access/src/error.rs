#[derive(Clone, Debug, thiserror::Error)]
pub enum Error {
    #[error("Database Error")]
    MongoDB(#[from] mongodb::error::Error),

    #[error("Cannot hash this password")]
    HashError,

    #[error("Cannot login either check username or password")]
    LoginError,

    #[error("Cannot find user with given id")]
    UserNotFound,

    #[error("Refresh token is invalid")]
    InvalidRefreshToken,

    #[error("Please Login to access this resource.")]
    Unauthorized,
}
