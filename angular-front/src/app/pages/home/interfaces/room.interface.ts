import { AmbulatoryArea } from "../../../enums/ambulatory-area.enum";
import { HospitalizedArea } from "../../../enums/hospitalized-area.enum";
import { OperatingRoomArea } from "../../../enums/operatingRoom-area.enum";
import { UrgencyArea } from "../../../enums/urgency-area.enum";

export interface RoomInterface{

  id: number;
  roomNumber: number;
  capacity: number;
  area: OperatingRoomArea | AmbulatoryArea | UrgencyArea | HospitalizedArea;
  floor: number;
  availability: boolean;
  idpatient?: number;
  
}
