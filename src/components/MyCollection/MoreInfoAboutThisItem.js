import React from 'react';

const MoreInfoAboutThisItem = (props) => {
    const { isShown, restIngredientsAmount } = props;
    return (
      <div className={`more-info-cover ${isShown ? 'show' : ''}`}>
        {
        restIngredientsAmount === 0
          ? (
            <>
              <p>Congrat!</p>
              <p>
  you can make this by yourself!
              </p>
            </>
          )
          : (
            <>
              <p>To make this cocktail,</p>
              <p>
  You still have
                <span>{restIngredientsAmount}</span>
  ingredients to buy!
              </p>
            </>
  
          )
      }
      </div>
    );
  };

  export default MoreInfoAboutThisItem;