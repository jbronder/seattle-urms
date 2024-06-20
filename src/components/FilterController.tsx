import { CheckToggler } from './CheckToggler.tsx';

const FilterController = ( props: {
  fnCrCb: (checkVal: boolean | 'indeterminate') => void
  fnHrCb: (checkVal: boolean | 'indeterminate') => void,
  fnMrCb: (checkVal: boolean | 'indeterminate') => void,
}) => {
  return (
    <>
      <CheckToggler
        labelTag="Critical Risk"
        cbHandler={props.fnCrCb}
      />
      <CheckToggler
        labelTag="High Risk"
        cbHandler={props.fnHrCb}
      />
      <CheckToggler
        labelTag="Medium Risk"
        cbHandler={props.fnMrCb}
      />
    </>
  );

};

export default FilterController;