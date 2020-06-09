import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(CreateSessionService);

    const session = await createSession.run({ email, password });

    delete session.user.password;

    return res.status(201).json(session);
  }
}
