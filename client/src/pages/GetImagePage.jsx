import { useParams } from 'react-router-dom';
import GetImageComponent from '../components/GetImageComponent';

function GetImagePage() {
  const { id } = useParams();

  return (
    <div className="image-page">
      <GetImageComponent imageId={id} />
    </div>
  );
}

export default GetImagePage;
