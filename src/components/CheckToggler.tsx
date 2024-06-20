import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

export function CheckToggler( props: { 
    labelTag: string,
    cbHandler: (checkVal: boolean | 'indeterminate') => void 
  }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <Checkbox.Root
        className="Toggler"
        defaultChecked={true}
        onCheckedChange={props.cbHandler}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label>{props.labelTag}</label>
    </div>
  );
}
