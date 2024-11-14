import ShortUniqueId from "short-unique-id";

class UniqueIDGenerator {
  private uidGenerator: ShortUniqueId;
  constructor(length = 10) {
    this.uidGenerator = new ShortUniqueId({ length });
  }

  public generate() {
    return this.uidGenerator.rnd();
  }
}

export default UniqueIDGenerator;
