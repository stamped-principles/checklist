import DATA from "./checklist.data.json" with { type: "json" };
import SCHEMA from "./checklist.linkml.schema.json" with { type: "json" };

const VERSION = SCHEMA.version;

export { VERSION, DATA };
