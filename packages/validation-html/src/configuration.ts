import { Constructable, IContainer, PLATFORM, Protocol, Registration } from '@aurelia/kernel';
import { getDefaultValidationConfiguration, ValidationCustomizationOptions, ValidationConfiguration } from '@aurelia/validation';
import { ValidationContainerCustomElement } from './subscribers/validation-container-custom-element';
import { ValidationErrorsCustomAttribute } from './subscribers/validation-errors-custom-attribute';
import { IDefaultTrigger, ValidateBindingBehavior, ValidationTrigger } from './validate-binding-behavior';
import { IValidationController, ValidationControllerFactory } from './validation-controller';
import { ValidationHtmlCustomizationOptions } from './validation-customization-options';

export type ValidationConfigurationProvider = (options: ValidationHtmlCustomizationOptions) => void;

export function getDefaultValidationHtmlConfiguration(): ValidationHtmlCustomizationOptions {
  return {
    ...getDefaultValidationConfiguration(),
    ValidationControllerFactoryType: ValidationControllerFactory,
    DefaultTrigger: ValidationTrigger.blur,
    UseSubscriberCustomAttribute: true,
    UseSubscriberCustomElement: true
  };
}

function createConfiguration(optionsProvider: ValidationConfigurationProvider) {
  return {
    optionsProvider,
    register(container: IContainer) {
      const options: ValidationHtmlCustomizationOptions = getDefaultValidationHtmlConfiguration();

      optionsProvider(options);

      const key = Protocol.annotation.keyFor('di:factory');
      Protocol.annotation.set(IValidationController as unknown as Constructable, 'di:factory', new options.ValidationControllerFactoryType());
      Protocol.annotation.appendTo(IValidationController as unknown as Constructable, key);

      container.register(
        ValidationConfiguration.customize((opt) => {
          // copy the customization iff the key exists in validation configuration
          for (const key of Object.keys(opt) as (keyof ValidationCustomizationOptions)[]) {
            if (key in options) {
              (opt as any)[key] = options[key]; // TS cannot infer that the value of the same key is being copied from A to B, and rejects the assignment due to type broadening
            }
          }
        }),
        Registration.instance(IDefaultTrigger, options.DefaultTrigger),
        ValidateBindingBehavior,
      );
      if (options.UseSubscriberCustomAttribute) {
        container.register(ValidationErrorsCustomAttribute);
      }
      if (options.UseSubscriberCustomElement) {
        container.register(ValidationContainerCustomElement);
      }
      return container;
    },
    customize(cb?: ValidationConfigurationProvider) {
      return createConfiguration(cb ?? optionsProvider);
    },
  };
}

export const ValidationHtmlConfiguration = createConfiguration(PLATFORM.noop);
