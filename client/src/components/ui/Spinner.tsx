// Small loading spinner. `fullScreen` centers it in the viewport.

interface SpinnerProps {
  fullScreen?: boolean;
}

const Spinner = ({ fullScreen = false }: SpinnerProps) => {
  const spinner = (
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-6">{spinner}</div>;
};

export default Spinner;
