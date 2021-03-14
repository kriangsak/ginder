import { Box, Button, Flex, Heading } from "rebass";

function HeaderLayout() {
  return (
    <Flex alignItems="center" px={3} py={0} mr={0} bg="muted">
          <Heading><h1>กินเดอร์ Ginder 🔥</h1></Heading>
          <Box mx="auto" />
          <Button>Beep</Button>
          <Button ml={2} variant="secondary">
            Boop
          </Button>
        </Flex>
  );
}

export default HeaderLayout;
