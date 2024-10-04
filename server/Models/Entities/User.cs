namespace ChatApp.Models
{
    public class User
    {
        public int Id { get; set; } 

        public string Username { get; set; }

        public string Password { get; set; } // The user's password (make sure to hash this before storing in DB)
    }
}
