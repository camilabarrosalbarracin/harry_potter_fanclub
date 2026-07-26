interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return <p role="alert">{message || "Something went wrong."}</p>;
}
