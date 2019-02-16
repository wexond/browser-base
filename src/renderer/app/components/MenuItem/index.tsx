export const MenuItem = ({ children }: any) => {
  return (
    <StyledMenuItem>
      <Icon />
      <Title>{children}</Title>
    </StyledMenuItem>
  );
};
