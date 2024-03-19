import { AddRoleEmbedCommand } from './add_role_embed';
import { RemoveRoleEmbedCommand } from './remove_role_embed';
import { SendRolesEmbedCommand } from './send_roles_embed';

export const ClaimRolesCommand = [SendRolesEmbedCommand, AddRoleEmbedCommand, RemoveRoleEmbedCommand];
