https://github.com/lorenwest/node-config/wiki/

1. Files in the config directory are loaded in the following order:

  default.js                   | default.js
  default-{instance}.js        |
  {deployment}.js              | development.js
  {deployment}-{instance}.js   |

  {hostname}.js
  {hostname}-{instance}.js
  {hostname}-{deployment}.js
  {hostname}-{deployment}-{instance}.js

  development.js
  local-{instance}.js
  local-{deployment}.js
  local-{deployment}-{instance}.js

  Where
  -----
  {instance} is an optional instance name string for Multi-Instance Deployments
  {hostname} is your server name, from the HOST -> HOSTNAME -> os.hostname()
  {deployment} is the deployment name, from the NODE_ENV environment variable

  The `local` files are intended to not be tracked in your version control system.
  External configuration management tools can write these files upon application deployment, before application loading.

2. Arrays are merged by replacement: the complete contents of an array in an override file will replace the complete array from a parent file.

3. The use of ECMAScript 5 getters in JavaScript configurations is not supported. Using deferred configuration values is the recommended alternative.

4. Usage:

   var config = require("config");

   config.get("option"); // throws an error!
   config.has("option");

5. NODE_ENV -- determines {deployment}
   NODE_CONFIG_DIR -- this contains the path to the directory containing your configuration files
   NODE_CONFIG -- example: NODE_CONFIG='{"Customer":{"dbConfig":{"host":"customerdb.prod"}}}'
   HOSTNAME -- determines {hostname}
   NODE_APP_INSTANCE -- determines {instance}
   ALLOW_CONFIG_MUTATIONS -- this is for edge cases such as testing, where it is important to mutate configurations for different scenarios within the same execution

6. config.util.getConfigSources() -- trace all file sources

7. Module configuration (PRO)
   https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration
