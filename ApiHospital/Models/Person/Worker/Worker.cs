namespace ApiHospital.Models {
    public abstract class Worker: Person {
        public required string User { get; set; }
        public required string WorkerType { get; set; }
        
    }
}