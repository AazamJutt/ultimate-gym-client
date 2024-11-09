import { Member } from "../models/Member";
import { Membership } from "../models/Membership";

export interface Dashboard {
  registeredMembers: Membership[];
  archivedMembers: Member[];
  inactiveMembers: Membership[];
  incomingFees: Membership[];
  paidFees: Membership[];
  pendingFees: Membership[];
  activeMembers: Membership[];
  presentMembers: Membership[];
}
