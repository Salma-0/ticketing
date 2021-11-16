import { Subjects, ExpirationCompleteEvent, Publisher } from "@saltickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}