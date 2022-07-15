const validateManifest = require('../index');

describe('manifest-validate', () => {
  test('manifest-01', () => {
    const ManifestExample = {
      id: 'f5590e0a-1f5f-45b4-a8bc-8829acbdd328',
      version: '0.0.5',
      name: {
        id: 'manifest.name',
        defaultMessage: '虚拟硬件',
        description: 'Manifest Name',
      },
      type: 'hardware',
      supportModes: ['online', 'upload'],
      description: '这是一个demo',
      icon: 'logo.svg',
      author: '你的名字',
      readme: '这是一个测试',
      USV: '0.3.0',
    };
    expect(() => validateManifest(ManifestExample)).not.toThrow();
  });
});
