namespace HospitalFaroAPI.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string dni_nif { get; set; }
        public string name { get; set; }

        public string surname { get; set; }

        public string? bedID { get; set; }

        public string condition { get; set; }
    }
}