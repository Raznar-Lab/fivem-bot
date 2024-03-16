import { IClaimRoleConfig } from './claim_roles';
import { IVMainConfig } from './fivem';

export interface IConfig {
    token: string;
    adminRoles: string[];
    fivemData: IVConfig[];
    fivemMain: IVMainConfig;
    claimRole: IClaimRoleConfig;
}
