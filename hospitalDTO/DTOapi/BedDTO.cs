namespace hospitalDTO.DTOapi {
    public class BedDTO {
        public int Id { get; set; }
        /*public int RoomId { get; set; }

        public Room Room { get; set; }*/
        public int? PatientId { get; set; }

        public PatientDTO? Patient { get; set; }
    }
}