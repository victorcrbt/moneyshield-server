import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, old_password, password } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.run({
      user_id: req.user.id,
      profile_data: {
        name,
        email,
        old_password,
        password,
      },
    });

    return res.status(201).json(user);
  }
}
