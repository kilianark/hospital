namespace hospitalDTO.DTOapi {
    public class RoomDTO {
        public int Id {get; set;}

        public ICollection<BedDTO> Beds { get; } = new List<BedDTO>();
    }
}