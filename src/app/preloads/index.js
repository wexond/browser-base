const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

const loadContent = require('../../shared/utils/load-content');

if (
  window.location.href.startsWith('wexond://newtab')
  || window.location.href.startsWith('http://localhost:8080/newtab.html')
) {
  loadContent('newtab');
} else if (
  window.location.href.startsWith('wexond://test-field')
  || window.location.href.startsWith('http://localhost:8080/test-field.html')
) {
  loadContent('testField');
}

const list = fs.readFileSync(
  path.resolve(__dirname, '../../../static/adblock/adblock-cosmetic.dat'),
  'utf8',
);
const filters = list.split('\n');

// if (window.location.protocol === 'wexond:') return;

let blockedSelectors = [];

for (let x = filters.length - 1; x >= 0; x--) {
  const filter = filters[x];
  const filterSelector = filter.split('##')[1];
  const filterDomains = filter.split('##')[0];

  if (filterSelector != null) {
    if (filterDomains === '') {
      if (blockedSelectors.indexOf(filterSelector) === -1) {
        blockedSelectors.push(filterSelector);
      }
    } else {
      const domains = filterDomains.split(',');

      let canPush = false;

      for (let y = 0; y < domains.length; y++) {
        const domain = domains[y].trim().toLowerCase();
        let loc = window.location.href.trim().toLowerCase();

        if (loc[loc.length - 1] === '/') {
          loc = loc.slice(0, -1);
        }

        if (domain.startsWith('~') && loc.endsWith(domain.split('~')[1])) {
          canPush = false;
          break;
        } else if (loc.endsWith(domain)) {
          canPush = true;
        }
      }

      if (canPush && blockedSelectors.indexOf(filterSelector) === -1) {
        blockedSelectors.push(filterSelector);
      }
    }
  }
}

blockedSelectors = blockedSelectors.filter((item, pos) => blockedSelectors.indexOf(item) === pos);

const createVirtualNode = node => {
  const attributes = [];

  for (const attribute of node.attributes) {
    const attr = {
      name: attribute.name,
      value: attribute.value,
    };

    attributes.push(attr);
  }

  const virtualNode = {
    tagName: node.tagName.toLowerCase(),
    attributes,
  };

  return virtualNode;
};

const child = fork(path.join(__dirname, 'child'));

const virtualNodes = [];

const findParentWithSize = (node, width, height) => {
  const nodes = [];

  if (node.parentNode) {
    const n = node.parentNode;

    if (n.offsetHeight === height) {
      nodes.push(n);
    }

    const newNodes = findParentWithSize(node.parentNode, width, height);

    for (const no of newNodes) {
      nodes.push(no);
    }
  }
  return nodes;
};

const attributeExists = (attributes, attribute) => {
  for (const attr of attributes) {
    if (attr.name === attribute.name && attribute.value === attr.value) return true;
  }
  return false;
};

const equals = (vNode1, vNode2) => {
  if (vNode1.tagName !== vNode2.tagName) return false;

  for (const attr of vNode1.attributes) {
    if (!attributeExists(vNode2.attributes, attr)) return false;
  }

  return true;
};

child.send({ blockedSelectors });

setInterval(() => {
  const tempNodes = document.getElementsByTagName('*');

  const newVNodes = [];

  for (const node of tempNodes) {
    const newVNode = createVirtualNode(node);

    let canPushNew = true;

    for (const vNode of virtualNodes) {
      if (equals(newVNode, vNode)) {
        canPushNew = false;
      }
    }

    if (canPushNew) {
      virtualNodes.push(newVNode);
      newVNodes.push(newVNode);
    }
  }

  if (newVNodes.length > 0) {
    child.send({ virtualNodes: newVNodes });
  }
}, 1000);

child.on('message', data => {
  if (!(data instanceof Array)) {
    console.log(data);
  }

  if (data instanceof Array) {
    for (const selector of data) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const vNode = createVirtualNode(element);
        virtualNodes.splice(virtualNodes.indexOf(vNode), 1);
        const parents = findParentWithSize(element, element.offsetWidth, element.offsetHeight);
        element.remove();

        for (const parent of parents) {
          if (parent) {
            parent.remove();
          }
        }
      }
    }
  }
});
