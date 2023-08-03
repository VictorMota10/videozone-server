import { Request, Response } from "express";
import { getInvitesService } from "../Services/InviteService/getInvitesService";

export class InvitesController {
  async getInvites(request: Request, response: Response) {
    try {
      const { uuid } = request.params
      const invites: any = await new getInvitesService().execute(uuid);

      return response.json(invites);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
