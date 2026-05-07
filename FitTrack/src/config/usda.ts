type UsdaLocalConfig = {
  USDA_API_KEY?: string;
};

let local: UsdaLocalConfig = {};

try {
  // Kept in a gitignored local file.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  local = require('./usda.local') as UsdaLocalConfig;
} catch {
  local = {};
}

export const USDA_API_KEY = (local.USDA_API_KEY || '').trim();

export const USDA_API_CONFIGURED = USDA_API_KEY.length > 0;
