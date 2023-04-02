const doctrine = require("doctrine");

const jsdocComment = `
/**
 * This is a sample function.
 *
 * @param {string} name - The name of the user.
 * @param {number} age - The age of the user.
 * @returns {Object} An object containing the user's name and age.
 */
`;

const parsedJSDoc = doctrine.parse(jsdocComment, { unwrap: true });

/** 

{
  description: '/**\nThis is a sample function.',
  tags: [
    {
      title: 'param',
      description: 'The name of the user.',
      type: [Object],
      name: 'name'
    },
    {
      title: 'param',
      description: 'The age of the user.',
      type: [Object],
      name: 'age'
    },
    {
      title: 'returns',
      description: "An object containing the user's name and age.\n/",
      type: [Object]
    }
  ]
}

 * 
*/

console.log(parsedJSDoc);
