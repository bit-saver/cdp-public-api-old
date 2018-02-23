const schema = {
  type: 'object',
  properties: {
    language_code: { type: 'string' },
    locale: { type: 'string' },
    text_direction: { type: 'boolean' },
    display_name: { type: 'string' },
    native_name: { type: 'string' },
    different_language: { type: 'boolean' }
  }
};

export default schema;
