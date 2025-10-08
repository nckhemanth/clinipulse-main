package cloud.nckhemanth.clinipulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CliniPulseApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CliniPulseApiApplication.class, args);
	}

}
