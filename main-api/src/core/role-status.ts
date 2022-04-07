import { DocumentStatus } from "src/entities";

export const ENCODER_RESTRICTION = [DocumentStatus.CHECKING_DISAPPROVED, DocumentStatus.DISAPPROVED, DocumentStatus.APPROVED];