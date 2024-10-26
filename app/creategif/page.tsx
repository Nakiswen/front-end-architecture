import GifCreator from './components/GifCreator';

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <GifCreator maxFileSize={5} maxFiles={10} />
    </div>
  );
}