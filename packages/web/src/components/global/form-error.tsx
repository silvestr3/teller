interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return <p className="text-destructive text-xs -mt-2">{message}</p>;
}
