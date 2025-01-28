type Props = {
  children?: React.ReactNode
}

const TextPrimary = (props: Props) => {
  return <span className="text-primary">
    {props.children}
  </span>
}

export default TextPrimary