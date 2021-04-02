import DriveMain from '../../components/DriveHome';
import BaseLayout from '../../components/BaseLayout';
import { useState } from 'react';

function DriveHome() {
  const [showDragNDrop, toggleDragNDrop] = useState(false);

  return (
    <>
      <BaseLayout>
        <div
          onMouseOver={() => toggleDragNDrop(true)}
          onMouseLeave={() => toggleDragNDrop(false)}
        >
          <DriveMain />
        </div>
        {showDragNDrop && <div>Hello</div>}
      </BaseLayout>
    </>
  );
}

export default DriveHome;
