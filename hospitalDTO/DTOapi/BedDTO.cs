namespace hospitalDTO.DTOapi {
    public class BedDTO {
        public required int Id { get; set; }
        public required string BedCode { get; set; }
        public required int RoomId { get; set; }
        public required bool Availability { get; set; }
    }
}