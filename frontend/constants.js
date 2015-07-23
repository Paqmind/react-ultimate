const AJAX = {
  throttleTimeoutMs: 500,
};

const ALERT = {
  throttleTimeoutMs: 100,
  expire: {
    success: 4000,
    info: 5000,
    warning: 6000,
  },
};

const ROBOT = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  }
};

const MONSTER = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  }
};

export default {
  AJAX, ALERT, ROBOT, MONSTER,
};
