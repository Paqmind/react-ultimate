if (typeof process == "object") {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";
}