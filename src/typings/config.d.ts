import { IClaimRoleConfig } from './claim_roles';
import { IVConfig, IVMainConfig } from './fivem';

export interface IConfig {
    token: string;
    adminRoles: string[];
    fivemData: IVConfig[];
    fivemMain: IVMainConfig;
    claimRole: IClaimRoleConfig;
}
