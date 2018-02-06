export const exists = doc => doc && doc.hits && doc.hits.total === 1;

export const getId = ( doc ) => {
  if ( doc && doc.hits && doc.hits.hits ) {
    return doc.hits.hits[0]._id;
  }
};

export const getSource = ( doc ) => {
  if ( doc && doc.hits && doc.hits.hits ) {
    return doc.hits.hits[0];
  }
};
