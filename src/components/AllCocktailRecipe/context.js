import React from 'react';

const AllCocktailRecipeContext = React.createContext(null);

export const getAllRecipeData = (CustomComponent) => (props) => (
  <AllCocktailRecipeContext.Consumer>
    {(allRecipe) => <CustomComponent {...props} allRecipe={allRecipe} />}
  </AllCocktailRecipeContext.Consumer>
);
export default AllCocktailRecipeContext;
