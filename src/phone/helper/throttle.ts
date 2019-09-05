
export function throttle(timeout: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    let lastExecution: number

    const method = descriptor.value

    descriptor.value = function (...args: any[]) {
      const now = Date.now()

      if (!lastExecution || now - lastExecution > timeout) {
        lastExecution = now
        method.apply(this, args)
      }
    }

    return descriptor
  }
}
